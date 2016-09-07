//templates for play/pause buttons
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
//templates for play/pause buttons at the player bar
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentVolume = 80;


var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentAlbum = null;
var currentSoundFile = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPauseButton = $('.main-controls .play-pause');

var updatePlayerBarSong = function() {
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
};
var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 }

var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };


var setSong = function(songNumber) {
    
    if (currentSoundFile) {
         currentSoundFile.stop();
     }
    
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         //create a new sound file from the library
         formats: [ 'mp3' ],
         preload: true
     });
    
    setVolume(currentVolume);
}

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number+ '"]');
}
var createSongRow = function(songNumber, songName, songLength) {
    
    //create a template for albumv view song rows
    var template =
          '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
    
    var $row = $(template);
    
    
    // clickhandler function
    var clickHandler = function() {

        var songNumber = parseInt($(this).attr('data-song-number'));

        if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        
         if (currentlyPlayingSongNumber !== songNumber) {
             // Switch from Play -> Pause button to indicate new song is playing.
             setSong(songNumber);
+            currentSoundFile.play();
             $(this).html(pauseButtonTemplate);             
             currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
             updateSeekBarWhileSongPlays();
             updatePlayerBarSong();
             
             var $volumeFill = $('.volume .fill');
             var $volumeThumb = $('.volume .thumb');
             $volumeFill.width(currentVolume + '%');
             $volumeThumb.css({left: currentVolume + '%'});

         } 
         else if (currentlyPlayingSongNumber === songNumber) {
            if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
            } else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();   
            }

         }
 
     };
    
    //listens to hover event
    var onHover = function(event) {
        
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        // if mouse pointer over a song which is not playing, play button shows
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
        

    };
    // listens for when mouse pointer leaves element
    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        // if mouse pointer leaves the song which is not playing
        // play button switches back to song number
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }   
    };
    //call the clickHandler
    $row.find('.song-item-number').click(clickHandler);
    //call the onHover offHover functions
    $row.hover(onHover, offHover);
    
    return $row;
    
};
// function to set current album
var setCurrentAlbum = function(album) {
     
     currentAlbum = album;
    //variables to display current album in
     //album view
     var $albumTitle = $(".album-view-title");
     var $albumArtist = $(".album-view-artist");
     var $albumReleaseInfo = $(".album-view-release-info");
     var $albumImage = $(".album-cover-art");
     var $albumSongList = $(".album-view-song-list");
     
     //populate the template with info from an album object
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year+" "+album.label);
     $albumImage.attr("src", album.albumArtUrl);
     
     //make sure innerHTML of albumSongList is empty
     $albumSongList.empty();
    
     for (var i = 0; i < album.songs.length; i++) {
         /*Loop through the songs array in the album object, populate
         the song rows and append them*/
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         
         $albumSongList.append($newRow);
         
     }
 };
var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    // #1
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    // #2
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

var updateSeekBarWhileSongPlays = function() {
 
    if (currentSoundFile) {
         // #10
         currentSoundFile.bind('timeupdate', function(event) {
             // #11
             
             var seekBarFillRatio = this.getTime() / this.getDuration();
             
             var $seekBar = $('.seek-control .seek-bar');
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
     }
 };



var setupSeekBars = function() {
     //find the see-bar within player bar
     var $seekBars = $('.player-bar .seek-bar');
 
     $seekBars.click(function(event) {
         //set a property to offsetX, x coordinate
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         //calculate the fill ratio
         var seekBarFillRatio = offsetX / barWidth;
 
         //
         
         if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);   
        }
         updateSeekPercentage($(this), seekBarFillRatio);
     });
    //find the .thumb and add an event listener
    $seekBars.find('.thumb').mousedown(function(event) {
         //find immediate parent of the node to differentiate between volume and seek
         var $seekBar = $(this).parent();
         // create an event listener to move the seekbars while pressing mouse
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;
             
             if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());   
            } else {
                setVolume(seekBarFillRatio);
            }
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
 
         //unbinded once mouse button is let go
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
 };

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
}
 

var nextSong = function() {
   
    var getLastSongNum = function(ind) {
        return ind == 0 ? currentAlbum.songs.length : ind;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    
    currentSongIndex++;
    
    if(currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    //set a current song
    setSong(currentSongIndex + 1);
    
    currentSoundFile.play();
    updateSeekBarWhileSongPlays
    //update the player bar
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNum(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};

var previousSong = function() {
   
    var getLastSongNum = function(ind) {
        return ind == (currentAlbum.songs.length - 1) ? 1 : ind + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    
    currentSongIndex--;
    
    if(currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    //set a current song
    setSong(currentSongIndex + 1);
    
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    //update the player bar
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNum(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};

var togglePlayFromPlayerbar = function() {
     var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
     if (currentSoundFile.isPaused()) {
         $currentlyPlayingCell.html(pauseButtonTemplate);
         $(this).html(playerBarPauseButton);
         currentSoundFile.play();
     } else if (currentSoundFile) {
         $currentlyPlayingCell.html(playButtonTemplate);
         $(this).html(playerBarPlayButton);
         currentSoundFile.pause();
     }
 };



//set the album when document loads
 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     setupSeekBars();
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
     $playPauseButton.click(togglePlayFromPlayerbar);
});