import React, { Component } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';
import styles from './App.css';

class App extends Component {
  state = {
    images: [],
    loading: false,
    error: null,
    query: '',
    page: 1,
    showModal: false,
    selectedImage: '',
  };

  componentDidUpdate(prevProps, prevState) {
    const { page, query } = this.state;

    if (prevState.page !== page || prevState.query !== query) {
      this.fetchImages();
    }
  }

  handleFormSubmit = query => {
    this.setState({ query, page: 1, images: [] });
  };

  fetchImages = () => {
    const { query, page } = this.state;
    const API_KEY = '36785926-9df8e575763dc5d4ea5ec1ee8';
    const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&page=${page}&per_page=12`;

    this.setState({ loading: true });

    fetch(URL)
      .then(response => response.json())
      .then(data => {
        const { hits } = data;

        this.setState(prevState => ({
          images: [...prevState.images, ...hits],
        }));
      })
      .catch(error => this.setState({ error }))
      .finally(() => this.setState({ loading: false }));
  };

  handleImageClick = imageUrl => {
    this.setState({ selectedImage: imageUrl, showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  handleLoadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  render() {
    const { images, loading, showModal, selectedImage } = this.state;

    return (
      <div className={styles.app}>
        <Searchbar onSubmit={this.handleFormSubmit} />
        {images.length > 0 && (
          <ImageGallery images={images} onImageClick={this.handleImageClick} />
        )}
        {loading && <Loader />}
        {!loading && images.length > 0 && (
          <Button onClick={this.handleLoadMore} />
        )}
        {showModal && (
          <Modal onClose={this.handleCloseModal}>
            <img src={selectedImage} alt="" />
            <button onClick={this.handleCloseModal}>Close</button>
          </Modal>
        )}
      </div>
    );
  }
}

export default App;
