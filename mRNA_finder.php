<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $seq_name = $_POST['seq_name'];
  $url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nucleotide&id=$seq_name&rettype=fasta&retmode=text";
  
  $mRNA = file_get_contents($url);

  if ($mRNA) {
    echo "$mRNA";
  } else {
    echo "Failed to fetch mRNA data.";
  }
}
?>
