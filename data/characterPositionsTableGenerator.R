
library(foreach)
setwd("C:/GitRepo/redivecalc/data/")
data.raw = read.csv("characterPositionsList.csv", header = FALSE, as.is = TRUE, na.strings = "")

# rearrage the character list into data.frame
data.df = foreach(i=1:nrow(data.raw), .combine = "rbind") %do% {
  # read i-th row
  data.array = data.raw[i,]
  # read number of columns
  data.array.length = length(data.array) - sum(is.na(data.array))
  # read the representing name of the character
  charTitle = data.array[data.array.length-1]
  names(charTitle) = NULL
  # read all character names used for search
  charNames = paste(data.array[1:(data.array.length-1)], collapse = " ")
  # read the character position as numeric
  charPosition = as.numeric(data.array[data.array.length])
  # return the rearranged row
  data.frame(charTitle=charTitle, charNames=charNames, charPosition=charPosition)
}

# write data.frame to csv
write.csv(data.df, file = "characterPositionsTable.csv", row.names = FALSE)
