function gerarMD5(texto) {
    function rotateLeft(x, n) {
        return (x << n) | (x >>> (32 - n));
    }

    function addUnsigned(x, y) {
        return (x + y) >>> 0;
    }

    const K = [];
    for (let i = 0; i < 64; i++) {
        K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) >>> 0;
    }

    const S = [
        7, 12, 17, 22, 7, 12, 17, 22,
        7, 12, 17, 22, 7, 12, 17, 22,
        5, 9, 14, 20, 5, 9, 14, 20,
        5, 9, 14, 20, 5, 9, 14, 20,
        4, 11, 16, 23, 4, 11, 16, 23,
        4, 11, 16, 23, 4, 11, 16, 23,
        6, 10, 15, 21, 6, 10, 15, 21,
        6, 10, 15, 21, 6, 10, 15, 21
    ];

    const bytes = new TextEncoder().encode(texto);
    const originalLength = bytes.length;

    const paddedLength = Math.ceil((originalLength + 9) / 64) * 64;
    const buffer = new Uint8Array(paddedLength);

    buffer.set(bytes);
    buffer[originalLength] = 0x80;

    const bitLength = originalLength * 8;
    const view = new DataView(buffer.buffer);

    view.setUint32(paddedLength - 8, bitLength >>> 0, true);
    view.setUint32(paddedLength - 4, Math.floor(bitLength / 4294967296), true);

    let a0 = 0x67452301;
    let b0 = 0xefcdab89;
    let c0 = 0x98badcfe;
    let d0 = 0x10325476;

    for (let offset = 0; offset < paddedLength; offset += 64) {
        const M = [];

        for (let i = 0; i < 16; i++) {
            M[i] = view.getUint32(offset + i * 4, true);
        }

        let A = a0;
        let B = b0;
        let C = c0;
        let D = d0;

        for (let i = 0; i < 64; i++) {
            let F, g;

            if (i < 16) {
                F = (B & C) | (~B & D);
                g = i;
            } else if (i < 32) {
                F = (D & B) | (~D & C);
                g = (5 * i + 1) % 16;
            } else if (i < 48) {
                F = B ^ C ^ D;
                g = (3 * i + 5) % 16;
            } else {
                F = C ^ (B | ~D);
                g = (7 * i) % 16;
            }

            const temp = D;
            D = C;
            C = B;

            const sum = addUnsigned(
                addUnsigned(A, F >>> 0),
                addUnsigned(K[i], M[g])
            );

            B = addUnsigned(B, rotateLeft(sum, S[i]));

            A = temp;
        }

        a0 = addUnsigned(a0, A);
        b0 = addUnsigned(b0, B);
        c0 = addUnsigned(c0, C);
        d0 = addUnsigned(d0, D);
    }

    function toHex(value) {
        return [0, 8, 16, 24]
            .map(shift => ((value >>> shift) & 0xff)
                .toString(16).padStart(2, "0"))
            .join("");
    }

    return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}
console.log(gerarMD5("alice"))