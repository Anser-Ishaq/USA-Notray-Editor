class DataHelper {
  getInitials(fullName: string) {
    // Split the full name by spaces
    const nameParts = fullName.trim().split(/\s+/);

    // Get the first name and the last name (if available)
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];

    // Extract the first letters of the first name and last name
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';

    // Return the initials concatenated together
    return firstInitial + lastInitial;
  }
}

export default new DataHelper();
