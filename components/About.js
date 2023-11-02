import React from 'react';
import Image from 'next/image';

const About = () => {
    return (
        <div className="container mx-auto py-12 px-4 md:px-8">
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
                
                <div className="md:w-1/2 md:pl-8 text-sm">
                    <p className="leading-relaxed mb-4">
                        Trevor Twomey is a professional music and street style photographer based in Brooklyn, New York. Though Trevor specializes in music photography, his skills extend beyond live performances. He has a talent for capturing spontaneous moments on the streets that many others might overlook. His works not only reflect the energy of the music community but also the soul of the streets.
                    </p>
                    
                    <p className="mb-4 leading-relaxed">
                        &quot;My passion for music and its entire world ignited at a young age, greatly influenced by my father who always had music playing and frequently attended concerts. Some of my fondest memories involve listening to songs with my dad or strumming my guitar. I&apos;m captivated by everything that unfolds on stage, behind the scenes, and amongst the crowd.&quot;
                    </p>
                    
                    <p className="leading-relaxed">
                        Over the years, he&apos;s honed his skills, and since 2013, had the incredible opportunity to capture extraordinary live shows and everyday life worldwide.
                    </p>
                    <br />
                    <p className="leading-relaxed">
                        If you&apos;d like more information about my work, or discuss potential commissioned projects, tours or events, feel free to reach out to me. 
                        
                        I look forward to connecting with you.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default About;
