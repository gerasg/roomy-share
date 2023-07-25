import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container, Row, Col, Image } from 'react-bootstrap';
import styles from '../styles/Gallery.module.css';

const spaces = {
  'Room 1': 4,
  'Room 2': 4,
  'Room 3': 4,
  'Bathroom': 4,
  'Toilet': 2,
  'Common areas': 4,
  'Kitchen': 4,
  'Balcony': 4,
  'Living Room': 4,
  'VIP Room': 4,
};

export default function Gallery() {
  const [show, setShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShow(true);
  };

  return (
    <div>
      <Header />
      <Container>
        {Object.entries(spaces).map(([space, numOfImages], index) => (
          <div key={index}>
            <h2 className={styles.spaceTitle}>{space}</h2>
            <Row xs={1} md={4} className="g-4">
              {[...Array(numOfImages)].map((_, imageIndex) => (
                <Col key={imageIndex}>
                  <Image
                    onClick={() => handleShow(`/images/gallery/${space}-${imageIndex}.jpg`)}
                    className={styles.image}
                    src={`/images/gallery/${space}-${imageIndex}.jpg`}
                    thumbnail
                  />
                </Col>
              ))}
            </Row>
            {index === Object.keys(spaces).length - 1 && <div className={styles.bottomSpace}></div>}
          </div>
        ))}
      </Container>
      {show && (
        <div className={styles.overlay}>
          <Image src={selectedImage} className={styles.modalImage} onClick={handleClose} fluid />
        </div>
      )}
    </div>
  );
}
