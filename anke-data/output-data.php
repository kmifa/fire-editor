<table>
	<?php
		$csv = fopen("data/data.csv","r");
		foreach($str as $data){
 
			$line = implode(',' , $data);
			echo $line;
			fwrite($csv, $line . "\n");

		}
		fclose($fp);
	?>
</table>