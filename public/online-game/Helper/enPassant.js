export let enPassantTarget = null;

export function updateEnPassantTarget(fromId, toId, piece) {
    if (piece.type === "pawn") {
        const fromRank = parseInt(fromId[1]);
        const toRank = parseInt(toId[1]);

        if (Math.abs(toRank - fromRank) === 2) {
            const enPassantRank = (fromRank + toRank) / 2;
            enPassantTarget = `${toId[0]}${enPassantRank}`;
            return;
        }
    }

    enPassantTarget = null;
}
