interface IResearchFieldEntry{
    field: string, 
    subfield: string,
    id: number,
    __typename: string
}

interface IResearchFieldQueryResult{
    researchfields: Array<IResearchFieldEntry>
}

interface IFieldSubfield {
    [key: string]: any
}

interface IResearchFieldFactoryReturnValues {
    mainResearchFields: Array<string>
    fieldSubfieldStore: IFieldSubfield
}





export function mapResearchFieldQueryResultToFormData(researchFieldQueryResult: IResearchFieldQueryResult): IResearchFieldFactoryReturnValues{

    const mainResearchFields = [...new Set(researchFieldQueryResult?.researchfields?.map(item => item.field))]
    const fieldSubfieldStore = {} as IFieldSubfield;
    mainResearchFields.forEach(researchField => {
        const values = researchFieldQueryResult?.researchfields?.filter(item => item.field === researchField).map(item => {
            return {
                subfield: item.subfield, id: item.id
            }
        });
        fieldSubfieldStore[researchField] = values
    })

    return {
        mainResearchFields,
        fieldSubfieldStore
    }
}