// nearestNeighbor.js
export function euclideanDistance(arr1, arr2) {
    return Math.sqrt(arr1.reduce((sum, val, idx) => sum + Math.pow(val - arr2[idx], 2), 0));
}

export function nearestNeighbors(userScore, companyData, topN = 5) {
    const distances = companyData.map(company => {
        const distance = euclideanDistance(userScore, company.companyScore);
        return { ...company, distance };
    });

    distances.sort((a, b) => a.distance - b.distance);
    return distances.slice(0, topN);
}
