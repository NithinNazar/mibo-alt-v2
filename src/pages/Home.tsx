
import Header from '../components/Header';
import OfferingsAndTherapy from '../components/offerings_Therapy';
import MiboCarousel from '../components/why_mibo';
// import MentalHealthCard from '../components/mentalhealth';


const Home = () => {
    return (
        <div>
            <div>
                <Header />
                {/* <MentalHealthCard /> */}
                <MiboCarousel />
                <OfferingsAndTherapy />
            </div>
        </div>
    );
};

export default Home;
