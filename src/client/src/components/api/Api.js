import React from 'react';
import styles from './Api.module.css';
import { Routes, Route, Link } from 'react-router-dom';
import { Default } from './routes/Default';
import { Holons } from './routes/Holons';
import { Allocations } from './routes/Allocations';
import { Tasks } from './routes/Tasks';
import { Users } from './routes/Users';
import { Algorithms } from './routes/Algorithms';
import { Nli } from './routes/Nli';
import { Settings } from './routes/Settings';
import { Auth } from './routes/Auth';
import { Status } from './routes/Status';
import { Search } from './routes/Search';

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
            <Route path="/allocations" element={<Allocations />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/users" element={<Users />} />
            <Route path="/algorithms" element={<Algorithms />} />
            <Route path="/nli" element={<Nli />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/status" element={<Status />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </div>
      </div>
    );
  }
}
