interface IResearchFieldEntry{
    field: string, 
    subfield: string,
    __typename: string
}

interface IResearchFieldQueryResult{
    researchfields: Array<IResearchFieldEntry>
}

interface IResearchFieldFactoryReturnValues {
    mainResearchFields: Array<string>
    fieldSubfieldStore: Object
}





export function mapResearchFieldQueryResultToFormData(researchFieldQueryResult: IResearchFieldQueryResult): IResearchFieldFactoryReturnValues{

    const mainResearchFields = [...new Set(researchFieldQueryResult?.researchfields?.map(item => item.field))]
    const fieldSubfieldStore = {}
    mainResearchFields.forEach(researchField => {
        const values = researchFieldQueryResult?.researchfields?.filter(item => item.field === researchField).map(item => item.subfield)
        fieldSubfieldStore[researchField] = values
    })

    return {
        mainResearchFields,
        fieldSubfieldStore
    }
}