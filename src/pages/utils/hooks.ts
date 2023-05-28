import { useEffect, useState } from "react"

export function useWindowDimensions() {
    const [size, setSize] = useState(getDimensions());

    useEffect(() => {
        const handleResize = () => {
            setSize(getDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return size;
}


function getDimensions() {
    return { width: window.innerWidth, height: window.innerHeight };
}
