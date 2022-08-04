import { Complex } from "src/Complex";
import { User } from "src/User/User";
import { v4 } from "uuid";

export interface PlotCollection {
    readonly id: typeof v4
    name: string
    description: string
    author: User
    locked: boolean

}

export interface BaseParameter {
    readonly id: typeof v4
    name: string
    latexLabel: string | null
    unit: string
    values: Complex[]
}

export interface ParameterConfig {
    readonly id: typeof v4
    domainMin: Complex
    domainMax: Complex
    hidden: boolean
}
