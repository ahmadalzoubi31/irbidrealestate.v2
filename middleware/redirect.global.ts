
export default defineNuxtRouteMiddleware((to, from) => {
    // skip middleware on server
    if (import.meta.server) return
    // skip middleware on client side entirely
    // if (import.meta.client) return

    // Use a temporary variable to avoid direct mutation
    // const newRedirectedPage = from?.fullPath || ""; // Safely handle undefined `from.fullPath`
    // const newIsRedirected = true; // Explicitly define the new state

    // Assign the temporary variables to the state
    // useState('redirectedPage').value = `${newRedirectedPage}`; // Ensure reactive assignment
    // useState('isRedirected').value = newIsRedirected; // Safely update the boolean state
    const counter = useState('counter', () => 5)
    return;
});
