import { memcpy } from "./env"
import { calcPackedVarUint32Length } from "./varint"

export namespace Utils {
    export function getDataStart<T>(arr: Array<T>): usize {
        return changetype<ArrayBufferView>(arr).dataStart;
    }

    export function toU8Array(ab: ArrayBuffer): Array<u8> {
        let size = ab.byteLength;
        let arr = new Array<u8>(size);
        memcpy(arr.dataStart, changetype<usize>(ab), size);
        return arr;
    }

    export function stringToU8Array(s: string): Array<u8> {
        let ab = String.UTF8.encode(s);
        return toU8Array(ab);
    }

    export function calcPackedStringLength(val: string): usize {
        let utf8Str = String.UTF8.encode(val);
        return calcPackedVarUint32Length(<u32>utf8Str.byteLength) + utf8Str.byteLength;
    }

    export function bytesToHex(bytes: u8[]): string {
        let hex: string[] = [];
        for (let i = 0; i < bytes.length; i++) {
            let c = bytes[i];
            hex.push((c >> 4).toString(16));
            hex.push((c & 0xF).toString(16));
        }
        return hex.join("");
    }
}