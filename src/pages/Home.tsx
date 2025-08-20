
import Header from '../components/Header';
import OfferingsAndTherapy from '../components/offerings_Therapy';
import MiboCarousel from '../components/why_mibo';
import  DepartmentGraphs from '../components/Department_Graph'
import CorporateLanding from '../components/who_its_for';
import MentalHealthServices from '../components/Services';

const Home = () => {
    return (
        <div>
            <div>
                <Header />
                <MiboCarousel />
                <OfferingsAndTherapy />
                <DepartmentGraphs />
                <CorporateLanding />
                <MentalHealthServices />
            </div>
        </div>
    );
};

export default Home;
