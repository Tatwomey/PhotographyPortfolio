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
                        Trevor Twomey is a professional music and street style photographer based in Brooklyn, New York. Though Trevor specializes in music photography, his skills extend beyond live performances. He has a talent for capturing spontaneous moments on the streets that many others might overlook. His works not only reflect the energy of the music community but also the soul of the streets.
                    </p>
                    <p className="mb-4 text-lg leading-relaxed">
                        His childhood experiences, marked by his identity as the son of dead heads and his adventures following bands from one venue to another, have deeply influenced his approach to photography. "My passion for music and its entire world ignited at a young age, greatly influenced by my father who always had music playing and frequently attended concerts. Some of my fondest memories involve listening to songs with my dad or strumming my guitar. I'm captivated by everything that unfolds on stage, behind the scenes, and amongst the crowd."
                    </p>
                    <p className="text-lg leading-relaxed">
                        Over the years, he's honed his skills, and since 2013, had the incredible opportunity to capture extraordinary live shows and everyday life worldwide. If you'd like more information about my work, or discuss potential commissioned projects, tours, or events, feel free to reach out to me at xxxxxxxxxx. I look forward to connecting with you.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default About;
