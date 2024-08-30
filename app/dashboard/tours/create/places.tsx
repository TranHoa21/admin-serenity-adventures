import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import "../../../style/tour/place.scss";
require('dotenv').config();
interface Place {
    id: number;
    name: string;
    address: string;
}

interface Option {
    value: string;
    label: string;
}

interface PlaceSelectProps {
    value: string | undefined;
    onChange: (value: string) => void;
}

export const PlaceSelect: React.FC<PlaceSelectProps> = ({ value, onChange }) => {
    const [places, setPlaces] = useState<Place[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<Option | null>(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const response = await axios.get<Place[]>(`${apiUrl}/place`);
                setPlaces(response.data);
            } catch (error) {
                console.error("Error fetching places:", error);
            }
        };

        fetchPlaces();
    }, []);

    useEffect(() => {
        if (value) {
            const place = places.find((place) => place.name === value);
            if (place) {
                setSelectedPlace({ value: place.name, label: place.name });
            } else {
                setSelectedPlace(null);
            }
        } else {
            setSelectedPlace(null);
        }
    }, [value, places]);

    const handleChange = (selectedOption: Option | null) => {
        setSelectedPlace(selectedOption);
        if (selectedOption) {
            onChange(selectedOption.value);
        } else {
            onChange("");
        }
    };

    const options = places.map((place) => ({
        value: place.name,
        label: place.name,
    }));
    const customStyles = {
        option: (provided: any) => ({
            ...provided,
            color: "black", // Đổi màu chữ của options sang màu đen
        }),
    };
    return (
        <Select
            className="place-select"
            options={options}
            value={selectedPlace}
            onChange={handleChange}
            styles={customStyles}
        />
    );
};