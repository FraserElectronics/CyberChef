/**
 * @author andyf [andy@fraserelectronics.co.uk]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation";
import OperationError from "../errors/OperationError";

const BITS_OPTIONS = ["8", "16", "32"];

/**
 * MultiCRC operation
 */
class MultiCRC extends Operation {

    /**
     * MultiCRC constructor
     */
    constructor() {
        super();

        this.name = "MultiCRC";
        this.module = "Default";
        this.description = "Configurable CRC Calculator";
        this.infoURL = "";
        this.inputType = "byteArray";
        this.outputType = "string";
        this.args = [
            {
                name: "Initial Value",
                type: "number",
                value: 0x0000
            },
            {
                name: "Polynomial",
                type: "number",
                value: 0x8408
            },
            {
                name: "Bits",
                type: "option",
                value: BITS_OPTIONS
            },
            {
                name: "Start Index",
                type: "number",
                value: 0
            },
            {
                name: "End Index",
                type: "number",
                value: 0
            }
        ];
    }

    computeCRC8( input, initial, polynomial, start, end )
    {
        return "CRC8";
    }
    
    computeCRC16( input, initial, polynomial, start, end )
    {
        return "CRC16";
    }

    computeCRC32( input, initial, polynomial, start, end )
    {
        var crc = initial;
        var byte = 0x00;
        var mask = 0x00;
        var i, j;
        
        for ( int i = start ; i <= end ; i++ )
        {
            byte = input[ i ];
            crc = crc ^ byte;
            for ( j = 7 ; j >= 0 ; j-- )
            {
                mask = ~( crc & 1 );
                crc = ( crc >> 1 ) ^ ( polynomial & mask );
            }
        }
        
        return "CRC32";
    }

    /**
     *
     * Computes a 8-bit or 16-bit CRC using the supplied initial
     * value and polynomial and the start and end index the CRC will
     * be computed over in the input byte array.
     *
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const initial = args[ 0 ],
            polynomial = args[ 1 ],
            bits = args[ 2 ],
            start = args[ 3 ],
            end = args[ 4 ];
        let output = "";
        
        if ( end < start )
        {
            throw new OperationError("End index must be larger that start index.");
        }
        else
        {
            if ( end - start > 0 )
            {
                switch( bits )
                {
                    case "8":
                        output = this.computeCRC8( input, initial, polynomial, start, end );
                        break;
                    case "16":
                        output = this.computeCRC16( input, initial, polynomial, start, end );
                        break;
                    case "32":
                        output = this.computeCRC32( input, initial, polynomial, start, end );
                        break;
                    default:
                        throw new OperationError( "CRC size must be 8, 16 or 32 bits.");
                }
            }
            else
            {
                throw new OperationError( "Length of data to compute CRC over must be greater than 0.");
            }
        }
        
        return output;
    }

    /**
     * Highlight MultiCRC
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        return pos;
    }

    /**
     * Highlight MultiCRC in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        return pos;
    }

}

export default MultiCRC;
