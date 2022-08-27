import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from '../components/header';

const Home = lazy(() => import('./home'));
const SearchResults = lazy(() => import('./search-results'));

const Router = () => (
    <BrowserRouter>
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchResults />} />
            </Routes>
        </Suspense>
    </BrowserRouter>
);

export default Router;