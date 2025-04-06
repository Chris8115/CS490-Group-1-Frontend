import React from 'react';
import {
    MDBCarousel,
    MDBCarouselInner,
    MDBCarouselItem,
    MDBCol,
    MDBRow,
  } from "mdb-react-ui-kit";

function ReviewCard( ) {
    return (
        <section style={{color: '#000'}}>
            <div class="container py-5">
            

                <div class="row text-center">
                <div class="col-md-4 mb-4 mb-md-0">
                    <div class="card">
                    <div class="card-body py-4 mt-2">
                        <div class="d-flex justify-content-center mb-4">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(10).webp"
                            className="rounded-circle shadow-1-strong " width="50" height="50" />
                        </div>
                        <h5 class="font-weight-bold">Teresa May</h5>
                        {/*<h6 class="font-weight-bold my-3">Founder at ET Company</h6>*/}
                        <ul class="list-unstyled d-flex justify-content-center">
                        <li>
                            <i class="fas fa-star fa-sm text-info"></i>
                        </li>
                        <li>
                            <i class="fas fa-star fa-sm text-info"></i>
                        </li>
                        <li>
                            <i class="fas fa-star fa-sm text-info"></i>
                        </li>
                        <li>
                            <i class="fas fa-star fa-sm text-info"></i>
                        </li>
                        <li>
                            <i class="fas fa-star-half-alt fa-sm text-info"></i>
                        </li>
                        </ul>
                        <p class="mb-2">
                        <i class="fas fa-quote-left pe-2"></i>“BetterU was a huge help when I decided I wanted to lose weight. Now, I don’t have to say no to my kids when they want to play outside.”
                        </p>
                    </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4 mb-md-0">
                    <div class="card">
                    <div class="card-body py-4 mt-2">
                        <div class="d-flex justify-content-center mb-4">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(15).webp"
                            class="rounded-circle shadow-1-strong" width="100" height="100" />
                        </div>
                        <h5 class="font-weight-bold">Maggie McLoan</h5>
                        {/*<h6 class="font-weight-bold my-3">Photographer at Studio LA</h6>*/}
                        <ul class="list-unstyled d-flex justify-content-center">
                        <li>
                            <i class="fas fa-star fa-sm text-info"></i>
                        </li>
                        <li>
                            <i class="fas fa-star fa-sm text-info"></i>
                        </li>
                        <li>
                            <i class="fas fa-star fa-sm text-info"></i>
                        </li>
                        <li>
                            <i class="fas fa-star fa-sm text-info"></i>
                        </li>
                        <li>
                            <i class="fas fa-star fa-sm text-info"></i>
                        </li>
                        </ul>
                        <p class="mb-2">
                        <i class="fas fa-quote-left pe-2"></i>“The doctors on this site are absolutely amazing. The community has given me so many top exercise ideas that I’ve used.”
                        </p>
                    </div>
                    </div>
                </div>
                <div class="col-md-4 mb-0">
                    <div class="card">
                    <div class="card-body py-4 mt-2">
                        <div class="d-flex justify-content-center mb-4">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(17).webp"
                            class="rounded-circle shadow-1-strong" width="100" height="100" />
                        </div>
                        <h5 class="font-weight-bold">Jackson Roberts</h5>
                        {/*<!--<h6 class="font-weight-bold my-3">Front-end Developer in NY</h6>*/}
                        <ul class="list-unstyled d-flex justify-content-center">
                        <li>
                            <i class="fas fa-star fa-sm text-info"></i>
                        </li>
                        <li>
                            <i class="fas fa-star fa-sm text-info"></i>
                        </li>
                        <li>
                            <i class="fas fa-star fa-sm text-info"></i>
                        </li>
                        <li>
                            <i class="fas fa-star fa-sm text-info"></i>
                        </li>
                        <li>
                            <i class="far fa-star fa-sm text-info"></i>
                        </li>
                        </ul>
                        <p class="mb-2">
                        <i class="fas fa-quote-left pe-2"></i>“When I felt I wasn’t making progress, seeing my charts right there kept me focused and gave me the motivation I needed.”
                        </p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </section>
    )
}

export default ReviewCard;