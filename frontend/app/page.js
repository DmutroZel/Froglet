'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [fact, setFact] = useState('');
  const [species, setSpecies] = useState('');
  const [image, setImage] = useState(null);
  const [loadingFact, setLoadingFact] = useState(false);
  const [loadingSpecies, setLoadingSpecies] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModal, setActiveModal] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const getFrogFact = async () => {
    setLoadingFact(true);
    try {
      const response = await fetch(`${API_URL}/frog-advice`);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      setFact(data.message || 'Fact not found');
      setActiveModal('fact');
    } catch (error) {
      console.error('Error fetching fact:', error);
      setFact('Error loading fact');
      setActiveModal('fact');
    } finally {
      setLoadingFact(false);
    }
  };

  const getYourFrog = async () => {
    setLoadingSpecies(true);
    try {
      const response = await fetch(`${API_URL}/your-kind-of-frog`);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      setSpecies(data.species || 'Species not found');
      setActiveModal('species');
    } catch (error) {
      console.error('Error fetching species:', error);
      setSpecies('Error loading species');
      setActiveModal('species');
    } finally {
      setLoadingSpecies(false);
    }
  };

  const getFrogImage = async () => {
    setLoadingImage(true);
    try {
      const response = await fetch(`${API_URL}/frog-image`);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      setImage(data);
      setActiveModal('image');
    } catch (error) {
      console.error('Error fetching image:', error);
      setImage(null);
      setActiveModal('image');
    } finally {
      setLoadingImage(false);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const searchFrogImage = async () => {
    if (!searchTerm.trim()) return getFrogImage();

    setLoadingImage(true);
    try {
      const query = encodeURIComponent(searchTerm.trim());
      const response = await fetch(`${API_URL}/frog-image?search=${query}`);
      if (!response.ok) throw new Error('Not found');
      const data = await response.json();
      setImage(data);
      setActiveModal('image');
    } catch (error) {
      setImage(null);
      setActiveModal('image');
    } finally {
      setLoadingImage(false);
    }
  };

  useEffect(() => {
    const fetchRandomFact = async () => {
      try {
        const response = await fetch(`${API_URL}/frog-advice`);
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        setFact(data.message || 'Random fact not found');
      } catch (error) {
        console.error('Error fetching random fact:', error);
        setFact('Error loading random fact');
      }
    };

    fetchRandomFact();
  }, []);

  return (
    <>
      <div className="bg-[#416a35] flex min-h-screen flex-col items-center justify-center gap-10 relative overflow-hidden" style={{fontFamily: 'Playpen Sans, sans-serif'}}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-6xl animate-bounce z-0 pointer-events-none ">
          🐸
        </div>
        <div className="relative z-10 flex flex-col items-center gap-10 px-4">
          <h1 className="text-5xl md:text-6xl text-white text-center mx-auto hover:scale-110 transition-all duration-300">
            Welcome to Frog API 🐸
          </h1>
          
          <div className="flex gap-6 md:gap-10 flex-wrap justify-center">
            <button onClick={getFrogFact} disabled={loadingFact} className="bg-[#639e51] text-white text-xl md:text-2xl px-8 py-6 rounded-[45px] shadow-md hover:scale-110 hover:shadow-2xl hover:bg-[#70ab5c] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-[280px]">
              {loadingFact ? '⏳ Loading...' : 'Get a Frog Fact'}
            </button>

            <button onClick={getYourFrog} disabled={loadingSpecies} className="bg-[#639e51] text-white text-xl md:text-2xl px-8 py-6 rounded-[45px] shadow-md hover:scale-110 hover:shadow-2xl hover:bg-[#70ab5c] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-[280px]">
              {loadingSpecies ? '⏳ Loading...' : 'What Kind of Frog Are You?'}
            </button>

            <button onClick={getFrogImage} disabled={loadingImage} className="bg-[#639e51] text-white text-xl md:text-2xl px-8 py-6 rounded-[45px] shadow-md hover:scale-110 hover:shadow-2xl hover:bg-[#70ab5c] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-[280px]">
              {loadingImage ? '⏳ Searching for frog...' : 'See a Frog'}
            </button>
          </div>

          <div className="flex gap-4 w-[500px] max-w-[90vw]">
            <p className="text-lg text-white text-center mx-auto hover:scale-110 transition-all duration-300">{fact}</p>
          </div>
        </div>

        {activeModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={closeModal}>
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
              <button onClick={closeModal} className="absolute top-4 right-6 text-gray-500 hover:text-gray-800 text-4xl hover:rotate-90 transition-all duration-300 font-light" aria-label="Close">
                ×
              </button>

              {activeModal === 'fact' && (
                <div className="space-y-6 text-center">
                  <h2 className="text-4xl font-bold text-[#416a35]">🐸 Fact</h2>
                  <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">{fact}</p>
                </div>
              )}

              {activeModal === 'species' && (
                <div className="space-y-6 text-center">
                  <h2 className="text-4xl font-bold text-[#416a35]">🔬 Your Frog Species</h2>
                  <p className="text-2xl md:text-3xl text-gray-700 italic font-medium">{species}</p>
                </div>
              )}

              {activeModal === 'image' && (
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold text-[#416a35] text-center">📸 A Frog for You</h2>
                  {image && image.imageUrl ? (
                    <div className="space-y-4">
                      <img src={image.imageUrl} className="w-full rounded-2xl shadow-xl object-cover max-h-[70vh] hover:scale-[1.02] transition-transform duration-500"/>
                    </div>
                  ) : (
                    <p className="text-center text-xl text-gray-600">Image not found </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}