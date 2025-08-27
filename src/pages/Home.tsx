
// import Header from '../components/Header';
// import OfferingsAndTherapy from '../components/offerings_Therapy';
// import MiboCarousel from '../components/why_mibo';
// import  DepartmentGraphs from '../components/Department_Graph'
// import CorporateLanding from '../components/who_its_for';
// import MentalHealthServices from '../components/Services';
// import MentalHealthConcerns from '../components/Concerns';
// import CareServiceComponent from '../components/Features';
// import SupportServices from '../components/Mibo_Supports';
// import lottie from 'lottie-web';
// import { defineElement } from 'lord-icon-element';
// import Location from '../components/Location';

// const Home = () => {


//     defineElement(lottie.loadAnimation);
//     return (
//         <div>
//             <div>
//                 <Header />
//                 <MiboCarousel />
//                 <OfferingsAndTherapy />
//                 <DepartmentGraphs />
//                 <CorporateLanding />
//                 <MentalHealthServices />
//                 <MentalHealthConcerns />
//                 <CareServiceComponent />
//                 <SupportServices />
//                 <Location />

//             </div>
//         </div>
//     );
// };

// export default Home;



import Header from '../components/Header';
import OfferingsAndTherapy from '../components/offerings_Therapy';
import MiboCarousel from '../components/why_mibo';
import DepartmentGraphs from '../components/Department_Graph';
import CorporateLanding from '../components/who_its_for';
import MentalHealthServices from '../components/Services';
import MentalHealthConcerns from '../components/Concerns';
import CareServiceComponent from '../components/Features';
import SupportServices from '../components/Mibo_Supports';
import Location from '../components/Location';
import ScrollRevealWrapper from '../components/ScrollRevealWrapper';
import lottie from 'lottie-web';
import { defineElement } from 'lord-icon-element';

const Home = () => {
    defineElement(lottie.loadAnimation);

    return (
        <div>
            <ScrollRevealWrapper>
                <Header />
            </ScrollRevealWrapper>

            <ScrollRevealWrapper>
                <MiboCarousel />
            </ScrollRevealWrapper>

            <ScrollRevealWrapper>
                <OfferingsAndTherapy />
            </ScrollRevealWrapper>

            <ScrollRevealWrapper>
                <DepartmentGraphs />
            </ScrollRevealWrapper>

            <ScrollRevealWrapper>
                <CorporateLanding />
            </ScrollRevealWrapper>

            <ScrollRevealWrapper>
                <MentalHealthServices />
            </ScrollRevealWrapper>

            <ScrollRevealWrapper>
                <MentalHealthConcerns />
            </ScrollRevealWrapper>

            <ScrollRevealWrapper>
                <CareServiceComponent />
            </ScrollRevealWrapper>

            <ScrollRevealWrapper>
                <SupportServices />
            </ScrollRevealWrapper>

            <ScrollRevealWrapper>
                <Location />
            </ScrollRevealWrapper>
        </div>
    );
};

export default Home;
