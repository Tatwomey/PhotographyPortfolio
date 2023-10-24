import React from 'react';
import Image from 'next/image';

const About = () => {
    return (
        <div className="container mx-auto py-12 px-4 md:px-8">
            <h1 className="text-4xl font-bold mb-8">About Trevor Twomey</h1>
            
            <div className="flex md:flex-row flex-col-reverse items-center">
                <div className="md:w-1/2">
                    <Image 
                        src="/trevor-twomey-1.jpg" 
                        alt="Trevor Twomey" 
                        width={500} 
                        height={500} 
                        className="rounded"
                    />
                </div>
                
                <div className="md:w-1/2 md:pl-8">
                    <p className="text-lg leading-relaxed mb-4">
                        Trevor Twomey is an accomplished music and street photographer rooted in Brooklyn, NY. With a particular talent for discerning the nuanced details and fleeting moments, he masterfully showcases both the rawness and the allure of urban life and vibrant music scenes. His dedication is evident in the way he pushes his gear, whether vintage or contemporary, to its full potential, ensuring each shot is a work of art.
                    </p>
                    <p className="mb-4 text-lg leading-relaxed">
                        While he remains deeply entrenched in music photography, capturing the essence of live performances for artists and aficionados alike, Trevor's gift extends to the streets, seizing spontaneous instances that many might overlook. His works not only reverberate with the pulsating energy of the music community but also encapsulate the very soul of bustling streets, and have been featured across an array of platforms and publications.
                    </p>
                    <p className="text-lg leading-relaxed">
                        Beyond freelancing, Trevor actively seeks collaboration with bands, offering his skills for tours and events, always with the intent to immortalize those distinctive moments that shape music gatherings. For collaborations or to witness the world through Trevor's lens, be it in the U.S. or globally, he is just a call away. For a closer look at his adventures and projects, dive into his blog and <a href="https://www.instagram.com/trevortwomey/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Instagram</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default About;
