import React, {useCallback} from "react";
import Attributes from "../components/Attributes";
import {Grid, Paper, TextField, Typography} from "@mui/material";
import AttributeType from "../types/attributes";
import {TextInput} from "../components/Form";
import Skills from "../components/Skills";

interface CharacterPageProps {
    onChange: (name: string, value: any) => void;
    stats: {
        name?: string,
        description?: string,
        image?: string,
        attributes: AttributeType,
        skills: {[key:string]: number},
    }
}

const derivedStyles: React.CSSProperties = {
    position: "relative",
    top: "-10px",
    margin: "auto",
    width: "80%",
    padding: 5,
};

export default function CharacterPage({stats, onChange} : CharacterPageProps) {
    const {attributes, skills, image='img/avatar.png'} = stats;
    const {CON=0, STR=0, AGI=0, INT=0, PER=0, COO=0} = attributes;

    const changeAttribute = useCallback(
        (name: string, value: number) => onChange('attributes', {...attributes, [name]: value}),
        [attributes]
    );

    const changeSkill = useCallback(
        (name: string, value: number) => onChange('skills', {...skills, [name]: value}),
        [skills]
    );

    const changeImage = useCallback(() => {
        const url = prompt('Image URL', image);
        if(url) onChange('image', url);
    }, []);

    const maxHealth = 8 + CON;
    const maxEdge = Math.ceil(4 + COO / 2);
    const vigilance = Math.ceil(3 + (INT+COO) / 3);

    return (<Grid container spacing={2} margin={1} direction="column">
        <Grid item container spacing={2} >
            <Grid item container xs={3} spacing={1} direction="column">
                <Grid item><TextInput label="Name" name="name" values={stats} onChange={onChange} /></Grid>
                <Grid item><div className="avatar" onClick={changeImage} style={{backgroundImage: `url("${image}")`}}></div></Grid>
            </Grid>
            <Grid item xs={6}>
                <TextInput label="Description" name="description" values={stats} onChange={onChange} multiline rows={8} />
                <Paper style={derivedStyles}>
                    <Typography align={"center"}>
                        Action Points {Math.ceil(3 + AGI/2)},
                        Speed {Math.ceil(3 + (CON+AGI) / 2)},
                        Heft {Math.ceil(STR/2)},
                        Cyber-Immunity {CON+STR}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item container xs={3} spacing={1} direction="column">
                <Grid item><TextField label="Health" fullWidth/></Grid>
                <Grid item><TextField label="Edge" fullWidth/></Grid>
                <Grid item><TextField label="Exp" fullWidth/></Grid>
                <Grid item><TextField label="Vigilance" fullWidth/></Grid>
            </Grid>
        </Grid>

        <Attributes onChange={changeAttribute} values={attributes} />
        <Skills onChange={changeSkill} attributes={attributes} skills={skills} />
    </Grid>);
}