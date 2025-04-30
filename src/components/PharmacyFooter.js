import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';

function PharmacyFooter() {
    return (
        <>
            <MDBFooter  className='text-center text-lg-start text-muted'>

            <section className=''>
                <MDBContainer className='text-center text-md-start mt-5'>
                <MDBRow className='mt-3'>
                    <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
                    <h6 className='text-uppercase fw-bold mb-4'>
                        <MDBIcon icon="gem" className="me-3" />
                        BigPharma
                    </h6>
                    </MDBCol>

                    <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4'>
                    <h6 className='text-uppercase fw-bold mb-4'>Products</h6>
                    <p>
                        <a href='/pharmacy-log-in' className='text-reset'>
                        Log In
                        </a>
                    </p>
                    <p>
                        <a href='/pharmacy/dashboard' className='text-reset'>
                        Pharmacy Dashboard
                        </a>
                    </p>
                    </MDBCol>

                    <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
                    <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
                    <p>
                        <MDBIcon icon="home" className="me-2" />
                        
                        Newark, NJ 07102, US
                    </p>
                    <p>
                        <MDBIcon icon="envelope" className="me-3" />
                        support@bigpharma.com
                    </p>
                    <p>
                        <MDBIcon icon="phone" className="me-3" /> + 01 201 555 2291
                    </p>
                    </MDBCol>
                </MDBRow>
                </MDBContainer>
            </section>

            <div className='text-center p-4' >
                © 2025 Copyright: <a className='text-reset fw-bold' href='#'>BigPharma</a>
            </div>
            </MDBFooter>
        </>
    )
}

export default PharmacyFooter;