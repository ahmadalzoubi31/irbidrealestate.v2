
export default defineNuxtRouteMiddleware((to, from) => {
    // skip middleware on server
    // if (import.meta.server) return
    // skip middleware on client side entirely
    // if (import.meta.client) return

    // Use a temporary variable to avoid direct mutation

    // const isRedirected = useState("isRedirected", () => false);
    // const redirectedPage = useState("redirectedPage", () => "ahmad");

    // Assign the temporary variables to the state
    // useState('redirectedPage').value = `${newRedirectedPage}`; // Ensure reactive assignment
    // useState('isRedirected').value = newIsRedirected; // Safely update the boolean state    
    return;
});
