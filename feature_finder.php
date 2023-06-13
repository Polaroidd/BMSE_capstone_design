<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $seq_name = $_POST['seq_name'];

  $url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nucleotide&id=$seq_name&retmode=XML";
  
  $feature = file_get_contents($url);
  $dom = new DOMDocument();
  $dom->loadXML($feature);
  $features = $dom->getElementsByTagName('GBFeature');
  foreach ($features as $f) {
    $featureKey = $f->getElementsByTagName('GBFeature_key')->item(0)->nodeValue;
    $featureLocation = $f->getElementsByTagName('GBFeature_location')->item(0)->nodeValue;
    $intervals = $f->getElementsByTagName('GBInterval');
    $qualifiers = $f->getElementsByTagName('GBQualifier');
    // echo "Feature Key : $featureKey".PHP_EOL;
    // echo "$featureKey","$featureLocation" . PHP_EOL;
    // echo "$featureLocation" . PHP_EOL;

    foreach ($intervals as $interval) {
      $from = $interval->getElementsByTagName('GBInterval_from')->item(0)->nodeValue;
      $to = $interval->getElementsByTagName('GBInterval_to')->item(0)->nodeValue;
      $accession = $interval->getElementsByTagName('GBInterval_accession')->item(0)->nodeValue;

      // echo "$from" . PHP_EOL;
      // echo "$to" . PHP_EOL;
  }

  foreach ($qualifiers as $qualifier) {
      $qualifierName = $qualifier->getElementsByTagName('GBQualifier_name')->item(0)->nodeValue;
      $qualifierValue = $qualifier->getElementsByTagName('GBQualifier_value')->item(0)->nodeValue;
      if ($qualifierName === 'note') {
        echo ">$featureKey\n$featureLocation\n$qualifierValue" . PHP_EOL;
    }
    
      
      // echo "Qualifier Name: $qualifierName" . PHP_EOL;
      // echo "$qualifierValue" . PHP_EOL;

  }

  // $feature = $feature->GBSeq
  // $count = (int) $xml->Count;
  // $count = (int) $xml->Count;
  // echo $count;
  // if ($feature) {
  //   $id =$xml->IdList->Id;
  //   echo "$id"
  //   echo "$feature";
  // } else {
  //   echo "Failed to fetch mRNA data.";
  // }
  }
}
?>


