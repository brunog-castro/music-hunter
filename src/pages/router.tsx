import { lazy, Suspense } from 'react';
import Header from '../components/header';
import Loader from '../components/loader';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('./home'));
const SearchResults = lazy(() => import('./search-results'));

const Router = () => (
    <BrowserRouter>
        <Header />
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchResults />} />
            </Routes>
        </Suspense>
    </BrowserRouter>
);

export default Router;