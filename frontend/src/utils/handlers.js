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

        const result = await sendApiRequest(functionEntry.apiRoute, requestBody);

        setFunctionResults({
            function: selectedFunction.name,
            results: result,
        });
    } catch (error) {
        setFunctionResults({ error: error.message || "Failed to execute function." });
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
        throw new Error(`Function not found: "${selectedFunction.name}"`);
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

    const functionName = functionEntry.name.trim().toLowerCase();

    let requestBody = {
        function: functionEntry.name,
        sequences: selectedSequences.map(seq => seq.data.trim()),
        filenames: selectedSequences.map(seq => seq.name),
        inputs: sanitizedInputs
    };

    if (functionName === "predict structure") {
        requestBody = {
            sequence: selectedSequences[0]?.data.trim() || "",
            "Sequence Type": sanitizedInputs["Sequence Type"] || "mRNA",
            "File Name": selectedSequences[0]?.name || "rna_structure"
        };

        if (sanitizedInputs["Energy Cutoff"] !== undefined && sanitizedInputs["Energy Cutoff"] !== "") {
            const parsedCutoff = parseFloat(sanitizedInputs["Energy Cutoff"]);
            if (!isNaN(parsedCutoff)) {
                requestBody["Energy Cutoff"] = parsedCutoff;
            }
        }
    }

    return requestBody;
};

const sendApiRequest = async (apiRoute, requestBody) => {
    const url = `${API_BASE_URL}${apiRoute}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(requestBody),
        });

        let responseData;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            responseData = await response.json();
        } else {
            responseData = await response.text();
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${responseData}`);
        }

        return responseData;

    } catch (error) {
        throw new Error(error.message || "API request failed.");
    }
};

const scrollToResults = (resultsRef) => {
    setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
};
