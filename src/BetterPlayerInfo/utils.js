export const hasAttackOrSupportIndicator = () => {
    return document.querySelector('.command-attack') !== null ||
        document.querySelector('.command-attack-ally') !== null ||
        document.querySelector('.command-support') !== null ||
        document.querySelector('.command-support-ally') !== null;
}