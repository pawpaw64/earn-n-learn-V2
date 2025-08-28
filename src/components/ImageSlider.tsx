import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { DotButton, PrevButton, NextButton } from './ui/CarouselButtons';

interface ImageSliderProps {
    slides: string[];
    children?: React.ReactNode;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ slides, children }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, [emblaApi, setSelectedIndex]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);

        const interval = setInterval(() => {
            if (emblaApi) {
                emblaApi.scrollNext();
            }
        }, 2500);

        return () => clearInterval(interval);
    }, [emblaApi, onSelect]);

    return (
        <div className="relative p-0 bg-gray-50 rounded-lg">
            <div className="overflow-hidden rounded-lg relative" ref={emblaRef}>
                <div className="flex">
                    {slides.map((slide, index) => (
                        <div className="flex-[0_0_100%] min-w-0 relative" key={index}>
                            <img
                                className="w-full h-full object-cover"
                                src={slide}
                                alt={`Slide ${index + 1}`}
                                style={{ height: '500px' }}
                            />
                            <div className="absolute inset-0 bg-black/40"></div>
                        </div>
                    ))}
                </div>
                {children && (
                    <div className="absolute inset-0 flex items-center justify-center text-center text-white p-4">
                        {children}
                    </div>
                )}
            </div>
            <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
            <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center">
                <div className="flex items-center space-x-2">
                    {scrollSnaps.map((_, index) => (
                        <DotButton
                            key={index}
                            selected={index === selectedIndex}
                            onClick={() => scrollTo(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageSlider;