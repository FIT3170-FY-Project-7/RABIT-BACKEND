export const parameterParse = (query: string | null) =>
	query?.substring(1, query.length - 1).split(",");
