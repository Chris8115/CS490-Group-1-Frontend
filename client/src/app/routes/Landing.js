import BetterUNavbar from "../../components/BetterUNavbar";
import Divider from "../../components/Divider";

function Landing() {
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
    </>
}

export default Landing;