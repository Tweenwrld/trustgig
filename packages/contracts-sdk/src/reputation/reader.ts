import type { UTxO } from '@meshsdk/core';
import { ReputationDatum, deserializeReputationDatum } from './types';

/**
 * Reputation UTXO reader
 */
export class ReputationReader {
    /**
     * Read reputation datum from UTXO
     */
    static readDatum(utxo: UTxO): ReputationDatum | null {
        if (!utxo.output.plutusData) {
            return null;
        }

        try {
            return deserializeReputationDatum(utxo.output.plutusData);
        } catch (error) {
            console.error('Failed to deserialize reputation datum:', error);
            return null;
        }
    }

    /**
     * Find reputation UTXO by user public key hash
     */
    static findByUser(utxos: UTxO[], userPkh: string): UTxO | null {
        for (const utxo of utxos) {
            const datum = this.readDatum(utxo);
            if (datum?.userPkh === userPkh) {
                return utxo;
            }
        }
        return null;
    }

    /**
     * Get all reputation UTXOs with scores above threshold
     */
    static findByMinScore(utxos: UTxO[], minScore: bigint): UTxO[] {
        return utxos.filter((utxo) => {
            const datum = this.readDatum(utxo);
            return datum && datum.score >= minScore;
        });
    }

    /**
     * Get reputation level based on score
     */
    static getLevel(score: bigint): string {
        if (score >= 800n) return 'Elite';
        if (score >= 600n) return 'Expert';
        if (score >= 400n) return 'Intermediate';
        if (score >= 200n) return 'Beginner';
        return 'Novice';
    }

    /**
     * Check if user is eligible for premium jobs (high reputation)
     */
    static isPremiumEligible(datum: ReputationDatum): boolean {
        return datum.score >= 600n && datum.completedJobs >= 10n;
    }

    /**
     * Get trust rating (0-5 stars)
     */
    static getTrustRating(datum: ReputationDatum): number {
        const completionRate = datum.totalJobs > 0n 
            ? Number(datum.completedJobs) / Number(datum.totalJobs)
            : 1.0;
        const scorePercentage = Number(datum.score) / 1000; // Assuming max score is 1000
        
        // Weighted average: 70% completion rate, 30% score
        const rating = (completionRate * 0.7 + scorePercentage * 0.3) * 5;
        return Math.round(rating * 10) / 10; // Round to 1 decimal
    }
}
