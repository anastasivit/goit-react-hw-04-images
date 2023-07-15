import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';
import styles from './App.css';

const App = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    fetchImages();
  }, [page, query]);

  const handleFormSubmit = query => {
    setQuery(query);
    setPage(1);
    setImages([]);
  };

  const fetchImages = () => {
    const API_KEY = '36785926-9df8e575763dc5d4ea5ec1ee8';
    const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&page=${page}&per_page=12`;

    setLoading(true);

    fetch(URL)
      .then(response => response.json())
      .then(data => {
        const { hits } = data;
        setImages(prevImages => [...prevImages, ...hits]);
      })
      .catch(error => setError(error))
      .finally(() => setLoading(false));
  };

  const handleImageClick = imageUrl => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className={styles.app}>
      <Searchbar onSubmit={handleFormSubmit} />
      {images.length > 0 && (
        <ImageGallery images={images} onImageClick={handleImageClick} />
      )}
      {loading && <Loader />}
      {!loading && images.length > 0 && <Button onClick={handleLoadMore} />}
      {showModal && (
        <Modal onClose={handleCloseModal}>
          <img src={selectedImage} alt="" />
          <button onClick={handleCloseModal}>Close</button>
        </Modal>
      )}
    </div>
  );
};

export default App;
