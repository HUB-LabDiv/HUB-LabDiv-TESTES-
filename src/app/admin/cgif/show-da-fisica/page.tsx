import React from 'react';
import { ShowAvailabilityClient } from './ShowAvailabilityClient';

export const metadata = {
    title: 'Moderação Show da Física | Admin HUB',
};

export default function AdminShowDaFisicaPage() {
    return (
        <div className="p-8">
            <ShowAvailabilityClient />
        </div>
    );
}
