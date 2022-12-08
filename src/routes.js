import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NewCollection from "./pages/NewCollection";

const PagesRoutes = () => {
    return (
        <Routes>
            <Route path="/" exact element={<HomePage />} />
            <Route path="/new-collection/:collectionType" element={<NewCollection />} />
        </Routes>
    )
};
export default PagesRoutes;