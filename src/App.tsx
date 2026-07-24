import React, { useState, useEffect } from 'react';
import { Search, Library, Grid3X3, WalletCards, RefreshCw } from 'lucide-react';
import { cardsDatabase } from './data';
import { CardItem } from './components/CardItem';
import { CardModal } from './components/CardModal';
import { AdminForm } from './components/AdminForm';
import { UserAuth } from './components/UserAuth';
import { FootballCard } from './types';
import { formatCurrency } from './lib/utils';
import { db, auth, onAuthStateChanged, collection, doc, setDoc, getDoc, User, deleteDoc, onSnapshot, getDocs } from './lib/firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState<'database' | 'collection' | 'admin'>('database');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState<FootballCard | null>(null);
  
  const [user, setUser] = useState<User | null>(null);
  const [collectionIds, setCollectionIds] = useState<Set<string>>(new Set());
  const [cards, setCards] = useState<FootballCard[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load user's collection
        const userRef = doc(db, 'users', currentUser.uid);
        const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setCollectionIds(new Set(docSnap.data().collectionIds || []));
          } else {
            setCollectionIds(new Set());
          }
        });
        return () => unsubscribeUser();
      } else {
        setCollectionIds(new Set());
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setLoadingCards(true);
    const cardsRef = collection(db, 'cards');
    const unsubscribe = onSnapshot(cardsRef, (snapshot) => {
      const loadedCards: FootballCard[] = [];
      snapshot.forEach(doc => {
        loadedCards.push({ id: doc.id, ...doc.data() } as FootballCard);
      });
      setCards(loadedCards);
      setLoadingCards(false);
    }, (error) => {
      console.error("Error fetching cards:", error);
      setLoadingCards(false);
    });

    return () => unsubscribe();
  }, []);

  const saveCollectionToFirebase = async (newCollection: Set<string>) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        email: user.email,
        collectionIds: Array.from(newCollection)
      }, { merge: true });
    } catch (error) {
      console.error("Error saving collection:", error);
    }
  };

  const [toastMessage, setToastMessage] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleToggleCollection = (cardId: string) => {
    if (!user) {
      setToastMessage("Please sign in to manage your collection.");
      return;
    }
    setCollectionIds(prev => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      saveCollectionToFirebase(next);
      return next;
    });
  };

  const handleAddCard = async (newCard: FootballCard) => {
    try {
      const { id, ...cardData } = newCard;
      const cardRef = doc(collection(db, 'cards'), id);
      await setDoc(cardRef, cardData);
      setActiveTab('database');
      setToastMessage("Card published successfully!");
    } catch (error) {
      console.error("Error adding card:", error);
      setToastMessage("Error adding card.");
    }
  };

  const handleResetDatabase = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    try {
      setLoadingCards(true);
      // Delete existing cards
      const snapshot = await getDocs(collection(db, 'cards'));
      const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletePromises);

      // Add default cards
      const addPromises = cardsDatabase.map(card => {
        const { id, ...cardData } = card;
        return setDoc(doc(db, 'cards', id), cardData);
      });
      await Promise.all(addPromises);
      
      setToastMessage("Database reset successfully.");
      setConfirmReset(false);
    } catch (error) {
      console.error("Error resetting database:", error);
      setToastMessage("Failed to reset database.");
      setConfirmReset(false);
    } finally {
      setLoadingCards(false);
    }
  };

  const filteredCards = cards.filter(card => {
    if (!card.imageUrl) return false;
    
    const player = card.player || '';
    const team = card.team || '';
    
    const matchesSearch = player.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          team.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (card.set || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (card.year || '').toString().includes(searchQuery) ||
                          (card.position || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'collection') {
      return matchesSearch && collectionIds.has(card.id);
    }
    return matchesSearch;
  });

  const collectionValue = Array.from(collectionIds).reduce((total, id) => {
    const card = cards.find(c => c.id === id);
    return total + (card?.currentPrice || 0);
  }, 0);

  const totalMarketCap = cards.filter(card => !!card.imageUrl).reduce((total, card) => total + card.currentPrice, 0);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans overflow-hidden selection:bg-[#D4FF00] selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <h1 className="text-3xl font-black tracking-tighter text-black uppercase">ARTCARD</h1>
            
            <nav className="hidden md:flex gap-8 text-sm font-black tracking-widest text-neutral-500 uppercase mt-1">
              <button 
                onClick={() => setActiveTab('database')}
                className={`transition-colors py-2 border-b-4 ${
                  activeTab === 'database' ? 'text-black border-black' : 'border-transparent hover:text-black hover:border-black'
                }`}
              >
                DATABASE
              </button>
              <button 
                onClick={() => setActiveTab('collection')}
                className={`transition-colors py-2 border-b-4 ${
                  activeTab === 'collection' ? 'text-black border-black' : 'border-transparent hover:text-black hover:border-black'
                }`}
              >
                COLLECTION
              </button>
              {(user?.email === 'grakibg@gmail.com' || user?.email === 'wwwrakibcom071@gmail.com') && (
                <button 
                  onClick={() => setActiveTab('admin')}
                  className={`transition-colors py-2 border-b-4 ${
                    activeTab === 'admin' ? 'text-black border-black' : 'border-transparent hover:text-black hover:border-black'
                  }`}
                >
                  ADMIN
                </button>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-black mb-1">Portfolio Value</span>
              <span className="text-sm font-black text-black bg-white px-3 py-1 border-2 border-black">{formatCurrency(collectionValue)}</span>
            </div>
            <UserAuth user={user} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Mobile Navigation */}
        <div className="md:hidden flex p-1 bg-neutral-100 border-2 border-black mb-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('database')}
            className={`flex-1 py-3 px-4 text-sm font-black tracking-widest transition-colors uppercase whitespace-nowrap ${
              activeTab === 'database' ? 'bg-white text-black border-2 border-black' : 'text-neutral-500 border-2 border-transparent'
            }`}
          >
            DATABASE
          </button>
          <button 
            onClick={() => setActiveTab('collection')}
            className={`flex-1 py-3 px-4 text-sm font-black tracking-widest transition-colors uppercase whitespace-nowrap ${
              activeTab === 'collection' ? 'bg-white text-black border-2 border-black' : 'text-neutral-500 border-2 border-transparent'
            }`}
          >
            COLLECTION
          </button>
          {(user?.email === 'grakibg@gmail.com' || user?.email === 'wwwrakibcom071@gmail.com') && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-3 px-4 text-sm font-black tracking-widest transition-colors uppercase whitespace-nowrap ${
                activeTab === 'admin' ? 'bg-white text-black border-2 border-black' : 'text-neutral-500 border-2 border-transparent'
              }`}
            >
              ADMIN
            </button>
          )}
        </div>

        {activeTab === 'admin' ? (
          (user?.email === 'grakibg@gmail.com' || user?.email === 'wwwrakibcom071@gmail.com') ? (
            <div className="max-w-2xl mx-auto space-y-8">
              <AdminForm onAdd={handleAddCard} totalCards={cards.filter(c => !!c.imageUrl).length} totalMarketCap={totalMarketCap} />
              
              <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-xl font-black uppercase tracking-tighter text-black mb-4">Danger Zone</h3>
                <p className="text-neutral-500 text-xs font-black uppercase tracking-widest mb-6">
                  Resetting the database will delete all custom cards and restore the default dataset.
                </p>
                <button 
                  onClick={handleResetDatabase}
                  disabled={loadingCards}
                  className={`w-full font-black uppercase tracking-widest py-4 border-2 border-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${
                    confirmReset ? 'bg-black text-white hover:bg-neutral-800' : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  <RefreshCw size={20} className={loadingCards ? 'animate-spin' : ''} />
                  {confirmReset ? 'ARE YOU SURE? CLICK AGAIN' : 'Reset Database'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 font-black tracking-widest text-neutral-500 uppercase">
               Access Denied
            </div>
          )
        ) : (
          <>
            {/* Search Bar */}
            <div className="relative mb-10 max-w-2xl">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={20} className="text-black" />
              </div>
              <input
                type="text"
                placeholder="SEARCH PLAYERS, TEAMS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-black rounded-none py-4 pl-12 pr-4 text-sm font-black text-black placeholder-neutral-500 focus:outline-none focus:ring-4 focus:ring-[#D4FF00]/50 transition-colors uppercase tracking-widest"
              />
            </div>

            {/* Tab Header Info */}
            <div className="mb-10 flex items-end justify-between border-b-2 border-black pb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">
                  {activeTab === 'database' ? 'CARD DATABASE' : 'MY COLLECTION'}
                </h1>
                <p className="text-neutral-500 mt-4 text-xs font-black uppercase tracking-widest">
                  {activeTab === 'database' 
                    ? 'EXPLORE HISTORICAL PRICE DATA FOR PREMIUM FOOTBALL CARDS.' 
                    : `YOU OWN ${collectionIds.size} CARDS VALUED AT ${formatCurrency(collectionValue)}.`
                  }
                </p>
              </div>
            </div>

            {/* Grid */}
            {loadingCards ? (
              <div className="flex justify-center py-32">
                 <RefreshCw size={48} className="text-neutral-300 animate-spin" />
              </div>
            ) : filteredCards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredCards.map(card => (
                  <CardItem 
                    key={card.id} 
                    card={card} 
                    inCollection={collectionIds.has(card.id)}
                    onClick={(c) => setSelectedCard(c)} 
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-black bg-neutral-100">
                <WalletCards size={48} className="text-black mb-6" />
                <h3 className="text-2xl font-black text-black mb-4 uppercase tracking-widest">NO CARDS FOUND</h3>
                <p className="text-neutral-500 max-w-md text-xs font-black uppercase tracking-widest">
                  {activeTab === 'collection' 
                    ? (user ? "YOU HAVEN'T ADDED ANY CARDS TO YOUR COLLECTION YET. BROWSE THE DATABASE TO START COLLECTING." : "PLEASE SIGN IN TO VIEW YOUR COLLECTION.")
                    : "NO CARDS MATCH YOUR SEARCH CRITERIA. TRY A DIFFERENT PLAYER OR TEAM."}
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Bottom Status Bar */}
      <footer className="h-14 shrink-0 bg-white border-t-2 border-black flex items-center justify-between px-8 text-[10px] uppercase font-black tracking-widest text-neutral-600">
        <div className="flex gap-8">
          <span className="flex items-center gap-2"><div className="w-2 h-2 bg-[#D4FF00] border border-black"></div> MARKET ONLINE</span>
          <span>INDEX: <span className="text-black font-bold">+1.2%</span></span>
        </div>
        <div className="hidden sm:block">© 2024 ARTCARD COLLECTIVE • SECURE NODE #1192-A</div>
      </footer>

      {/* Detail Modal */}
      <CardModal 
        card={selectedCard} 
        isOpen={!!selectedCard} 
        onClose={() => setSelectedCard(null)} 
        inCollection={selectedCard ? collectionIds.has(selectedCard.id) : false}
        onToggleCollection={handleToggleCollection}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-6 py-3 font-black text-sm tracking-widest uppercase border-2 border-[#D4FF00] shadow-[4px_4px_0px_0px_#D4FF00] animate-in slide-in-from-bottom-5 fade-in duration-300">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
