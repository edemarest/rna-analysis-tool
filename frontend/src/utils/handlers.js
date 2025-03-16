const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5001";

export const handleSequenceUpload = (name, data, setSequences) => {
    const newSequence = {
        name,
        data: data.trim(),
        type: "FASTA"
    };

    setSequences((prev) => [...prev, newSequence]);
};

export const handleSelectSequence = (sequence, setSelectedSequences, setSelectedFunction, setShowConfig) => {
    setSelectedSequences((prev) => {
        if (prev.includes(sequence)) {
            return prev.filter((s) => s !== sequence);
        } else if (prev.length < 2) {
            return [...prev, sequence];
        }
        return prev;
    });
    setSelectedFunction(null);
    setShowConfig(false);
};

export const handleFunctionSelect = (func, setSelectedFunction, setShowConfig) => {
    setSelectedFunction(func);
    setShowConfig(true);
};

export const handleBackToFunctions = (setSelectedFunction, setShowConfig) => {
    setSelectedFunction(null);
    setShowConfig(false);
};

export const handleRunFunction = async (
    selectedFunction,
    selectedSequences,
    inputValues,
    setIsLoading,
    setFunctionResults,
    functionData,
    resultsRef
) => {
    setIsLoading(true);
    setFunctionResults(null);

    try {
        validateFunction(selectedFunction);
        const functionEntry = findFunctionEntry(selectedFunction, functionData);
        validateApiRoute(functionEntry);
        validateSequences(selectedSequences);

        const requestBody = createRequestBody(functionEntry, selectedSequences, inputValues);
        console.log("Sending API request:", JSON.stringify({
            ...requestBody,
            sequences: requestBody.sequences.map(seq => seq.slice(0, 50))
        }, null, 2));

        const result = await sendApiRequest(functionEntry.apiRoute, requestBody);
        console.log("API Response:", {
            ...result,
            sequences: result.sequences?.map(seq => seq.slice(0, 50))
        });
        setFunctionResults(result);
    } catch (error) {
        setFunctionResults({ error: "Failed to execute function." });
    }

    setIsLoading(false);
    scrollToResults(resultsRef);
};

const validateFunction = (selectedFunction) => {
    if (!selectedFunction || typeof selectedFunction !== "object" || !selectedFunction.name) {
        throw new Error(`Invalid function object: ${JSON.stringify(selectedFunction)}`);
    }
};

const findFunctionEntry = (selectedFunction, functionData) => {
    const functionEntry = functionData.singleSequence
        .concat(functionData.multiSequence)
        .find((f) => f.name.trim().toLowerCase() === selectedFunction.name.trim().toLowerCase());

    if (!functionEntry) {
        throw new Error(`Function not found in functionData: "${selectedFunction.name}"`);
    }

    return functionEntry;
};

const validateApiRoute = (functionEntry) => {
    if (!functionEntry.apiRoute) {
        throw new Error(`API route missing for function: ${functionEntry.name}`);
    }
};

const validateSequences = (selectedSequences) => {
    if (selectedSequences.length === 0) {
        throw new Error("No sequences selected. Please upload a FASTA file.");
    }
};

const createRequestBody = (functionEntry, selectedSequences, inputValues) => {
    const sanitizedInputs = { ...inputValues };

    if ("Motif Length" in sanitizedInputs) {
        sanitizedInputs["Motif Length"] = parseInt(sanitizedInputs["Motif Length"], 10);
    }

    return {
        function: functionEntry.name,
        sequences: selectedSequences.map(seq => seq.data.trim()),
        filenames: selectedSequences.map(seq => seq.name),
        inputs: sanitizedInputs,
    };
};

const sendApiRequest = async (apiRoute, requestBody) => {
    const response = await fetch(`${API_BASE_URL}${apiRoute}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorResponse}`);
    }

    const jsonResponse = await response.json();
    return jsonResponse;
};

const scrollToResults = (resultsRef) => {
    setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
};
