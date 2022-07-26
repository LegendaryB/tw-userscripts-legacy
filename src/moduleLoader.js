const addModule = (src) => {
    const scriptElement = document.createElement('script');
    scriptElement.type = 'module';
    scriptElement.src = src;

    document.head.appendChild(scriptElement);
}