
import Header from '../components/Header';
import OfferingsAndTherapy from '../components/offerings_Therapy';
import MiboCarousel from '../components/why_mibo';

const Home = () => {
    return (
        <div>
            <div>
                <Header />
                <MiboCarousel />
                <OfferingsAndTherapy />
            </div>
        </div>
    );
};

export default Home;
