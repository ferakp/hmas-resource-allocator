import React from 'react';
import styles from './Api.module.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Default } from './routes/Default';
import { Holons } from './routes/Holons';

export class Api extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.title}>REST API Documentation</p>
        </div>
        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<Default />} />
            <Route path="/holons" element={<Holons />} />
          </Routes>
        </div>
      </div>
    );
  }
}
