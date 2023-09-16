import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container, Row, Col, Image } from 'react-bootstrap';
import styles from '../styles/Gallery.module.css';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const spaces = {
  'room1': 4,
  'room2': 4,
  'room3': 4,
  'bathroom': 4,
  'restroom': 2,
  'commonAreas': 4,
  'kitchen': 4,
  'balcony': 4,
  'livingRoom': 4,
  'vipRoom': 4,
};

export default function Gallery() {
  const { t } = useTranslation();
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
            <h2 className={styles.spaceTitle}>{t(space)}</h2>
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

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...await serverSideTranslations(locale, ['common', 'footer']),
    },
  }
}