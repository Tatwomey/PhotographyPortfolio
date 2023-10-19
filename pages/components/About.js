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
                        Trevor Twomey is a music and lifestyle photographer based in Brooklyn, NY. Specializing in music photography, he captures the live experience for artists and fans alike with a unique passion and style. In addition to his freelance work, Trevor is open to working directly with bands and is available for tours, bringing with him an eye for the distinct moments that define music events.
                    </p>
                    <p className="mb-4 text-lg leading-relaxed">
                        His work resonates with the energy and spirit of the music community and has graced various platforms and publications. Being in the heart of the music scene, Trevor&apos;s expertise is not limited to just capturing the event, but in translating the very essence of the moment into a lasting memory.
                    </p>
                    <p className="text-lg leading-relaxed">
                        Trevor is available for hire in the U.S. and worldwide. To stay updated with his latest projects and journeys, follow him on his blog and <a href="https://www.instagram.com/trevortwomey/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Instagram</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default About;
