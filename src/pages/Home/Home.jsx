import Banner from "@/pages/Home/Banner";
import PetsCategory from "./PetsCategory";
import { Helmet } from "react-helmet-async";
import HappyTails from "./HappyTails";
import AboutUs from "./AboutUs";
import FAQ from "./FAQ";
import Blog from "./Blog";

const Home = () => {
    return (
        <div>
            <Helmet>
                <title>Home | Pet Squad</title>
            </Helmet>
            <Banner></Banner>
            <PetsCategory></PetsCategory>
            <AboutUs></AboutUs>
            <Blog></Blog>
            <HappyTails></HappyTails>
            <FAQ></FAQ>
    
        </div>
    );
};

export default Home;