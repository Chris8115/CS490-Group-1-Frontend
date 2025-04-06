import BetterUNavbar from "../../components/BetterUNavbar";
import Divider from "../../components/Divider";
import DescriptionCard from "../../components/DescriptionCard";
import ReviewCard from "../../components/ReviewCard";
import Footer from "../../components/Footer";

import gymImage from '../../assets/gym_img.png';
import docImage from '../../assets/doc_img.png';
import statsImage from '../../assets/stats_img.png';

function Landing() {
    console.log("hello world");

    return <>
        <BetterUNavbar/>

        <div className="banner">
            <div>
                <h1>Achieve your <span className="special-text">dream body</span> - without the hassle.</h1>
                <p>Browse from hundreds of doctors, specializing in fitness, weight loss, and nutrition, today.</p>
            </div>
            <button className="btn btn-primary make-account-btn">Make your account for <br/>free today</button>
        </div>

        <Divider/>

        <div className="description">

            <h2 className="description-title">We bring the doctors to you.</h2>
            <div className="cards">
                <DescriptionCard 
                    title="Nutrition, weight loss, exercise, and more." 
                    descrip="Our doctors are experts who've helped countless patients with on their fitness journey." 
                    img={gymImage} />

                <DescriptionCard 
                    title="No Hassle, No Commitment." 
                    descrip="Book an appointment with a doctor of your choice anytime, and switch doctors anytime, no hassle." 
                    img={docImage} />

                <DescriptionCard 
                    title="See your real-time progress." 
                    descrip="We provide you with daily and weekly progress checks and visualizing of your goals." 
                    img={statsImage} />
            
            </div>
        </div>

        <Divider />

        <div className="reviews">
            <h2>Don’t just take it from us - results from real patients.</h2>
            <ReviewCard />
        </div>

        <Divider />

        <div className="footer-sign-up">
            <h1>Ready to try? Sign up today.</h1>
            <button className="btn btn-primary footer-sign-up-btn">Make an account today</button>
        </div>

        <Divider />

        <Footer />
        
        
    </>
}

export default Landing;