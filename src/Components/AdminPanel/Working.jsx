const handleDownload = async (pdfPath) => {
  try {
    const filename = pdfPath.split("/").pop(); // Extract only the filename
    const response = await fetch(`https://api.hachion.co/curriculum/pdf/${filename}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/pdf",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch PDF");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link to trigger download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading PDF:", error);
  }
};

<button onClick={() => handleDownload(blogData.blog_pdf)}>Download PDF</button>
