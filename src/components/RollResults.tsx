import React, {useState} from "react";
import {DiceResultType} from "../types/dice";
import * as uuid from 'uuid';
import {Modal, Paper, Typography} from "@mui/material";
import socket from "../socket";
import {DiceSymbol} from "./Roll";

interface RollResultProps {

}

interface RollEntry {
    id: string;
    result: DiceResultType,
    summary: Record<string, number>;
    metadata: Record<string, any>;
}

function summarize(result: DiceResultType): Record<string, number> {
    const summary: Record<string, number> = {};

    result
        .map(r => r.symbols)
        .flat()
        .filter(s => s !== "explosive")
        .forEach(s => summary[s] = 1 + (summary[s] || 0));

    return summary;
}

export function RollResult({}: RollResultProps) {
    const [rolls, setRolls] = useState<RollEntry[]>([]);
    const [details, setDetails] = useState<RollEntry|null>(null);

    socket.removeAllListeners("roll")
    socket.on("roll", (result, metadata) => {
        setRolls([{
            id: uuid.v4(),
            summary: summarize(result),
            result,
            metadata: metadata || {},
        }, ...rolls])
    });

    return <div className="resultArea">
        {rolls.map(roll => <Paper className="rollResult" onClick={() => setDetails(roll)}>
            <strong>{roll.metadata['player']}: {roll.metadata['skill']}</strong>
            {Object.keys(roll.summary).map(s => <div>{s}: {roll.summary[s]}</div>)}
        </Paper>)}


        <Modal open={details !== null} onClose={() => setDetails(null)}>
            <Paper className="paperLarge">
                <Typography variant={"h4"} textAlign={"center"}>{details?.metadata['player']}: {details?.metadata['skill']}</Typography>
                <div className=" rollDetails">
                    {details?.result.map(r => <DiceSymbol type={r.type} symbols={r.symbols} exploded={r.exploded} />)}
                </div>
            </Paper>
        </Modal>
    </div>;
}